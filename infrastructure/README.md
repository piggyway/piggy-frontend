# Piggyway infrastructure

Terraform configuration for the Piggyway AWS staging environment in
`ap-southeast-2`.

## Safety rules

- This account is on the AWS Free plan. Do not create or join an AWS
  Organization: doing so automatically upgrades the account and invalidates
  its Free Tier credits.
- Use an MFA-protected IAM administrator for daily console access. Authenticate
  the local AWS CLI with `aws login` so Terraform receives temporary session
  credentials; do not create root or IAM user access keys.
- Never commit `backend.hcl`, state, plans, credentials, runtime secrets, or
  production data.
- Existing AWS resources are imported before any new infrastructure is added.
- Review a saved plan before every apply. NAT Gateway, RDS, ALB, and Fargate
  changes require an explicit cost review.
- Runtime secret values are written directly to Secrets Manager with a
  temporary `aws login` session. Terraform owns only secret containers and IAM
  access policies.

## Layout

- `bootstrap/state`: one-time encrypted S3 state bucket with native lock files.
- `environments/staging`: staging root module and import declarations.
- `modules`: reusable infrastructure modules.

## Bootstrap state

Use local state only for the bootstrap configuration:

```bash
cd bootstrap/state
terraform init
terraform plan -out=bootstrap.tfplan \
  -var='state_bucket_name=piggyway-terraform-state-ACCOUNT_ID-ap-southeast-2'
terraform apply bootstrap.tfplan
```

Copy `environments/staging/backend.hcl.example` to the ignored
`environments/staging/backend.hcl` and replace the account ID placeholder.

## Import the existing staging foundation

```bash
cd environments/staging
terraform init -backend-config=backend.hcl
terraform fmt -check -recursive ../..
terraform validate
terraform plan -out=import.tfplan
terraform show import.tfplan
```

The first import plan covers the known VPC, four subnets, five security groups,
three ECR repositories, ECS cluster, and DB subnet group. Before applying it,
discover and model the existing internet gateway, route tables, associations,
routes, and individual security-group rules. Do not create new resources until
the import plan contains no unexplained replacement or deletion.

## AWS Free plan authentication

IAM Identity Center organization instances are intentionally disabled for this
account because enabling AWS Organizations would forfeit its Free Tier credits.
Use this workflow instead:

1. Sign in as the MFA-protected IAM administrator, not the root user.
2. Attach the AWS managed `SignInLocalDevelopmentAccess` policy to that user.
3. Run `aws login --profile piggyway-staging` locally and complete the browser
   authentication flow.
4. Confirm the identity with
   `aws sts get-caller-identity --profile piggyway-staging`.
5. Export `AWS_PROFILE=piggyway-staging` before running Terraform. The local
   session is temporary and must be renewed after it expires.

Never create a long-lived access key as a workaround. Root remains an emergency
identity only after the IAM administrator is verified.

## Required environment

- Terraform 1.15.8
- AWS CLI v2 with support for `aws login`
- An active IAM administrator `aws login` session
- `AWS_REGION=ap-southeast-2`
- Cloudflare zone access with permission to edit `piggyway.com.au` DNS records

## Free plan cost guardrails

At initial bootstrap on 2026-08-12, the Billing console showed an estimated
Free Tier credit balance of USD 139.38. The free account closes when its credits
are exhausted or six months after account creation, whichever comes first.

- Create an AWS Budget before NAT Gateway, RDS, ALB, or Fargate resources.
- Review the estimated monthly burn before every cost-gated apply.
- Destroy disposable staging resources when they are not needed.
- Keep state, final snapshots, and recovery documentation before teardown.

## Phase 2 network foundation

Phase 2 was applied on 2026-08-12 from a saved plan. The apply result was
`39 added, 3 changed, 0 destroyed`, followed by a clean `terraform plan`.

- Two existing private application subnets route outbound traffic through one
  NAT Gateway in `ap-southeast-2a`.
- Two isolated `/24` database subnets span `ap-southeast-2a` and
  `ap-southeast-2b`. Their route table contains only the VPC-local route.
- The RDS subnet group contains only those isolated database subnets.
- ALB ports 80 and 443 accept IPv4 traffic only from the Cloudflare proxy
  ranges pinned in `environments/staging/locals.tf`.
- Cloud Map provides the private namespace `piggyway-staging.local` and the
  `backend` A-record service used by the future ECS service.

The NAT Gateway and its public IPv4 address begin consuming credits as soon as
they exist. At the 2026-08-12 Sydney rates reviewed before apply, the expected
idle network baseline is approximately USD 47/month before data processing.
Check Billing and the `piggyway-staging-monthly` budget regularly.

Validate the deployed network without changing it:

```bash
cd environments/staging
AWS_PROFILE=piggyway-staging AWS_REGION=ap-southeast-2 \
  terraform plan -detailed-exitcode
terraform output
```

Do not run a broad `terraform destroy`: the state also owns imported shared
resources. To roll back Phase 2, first change the DB subnet group back to the
two application subnets, then remove only the Phase 2 resources from the
configuration, save and review the resulting plan, and apply it only after
confirming that imported resources are not scheduled for deletion.

## Phase 3 database and secrets foundation

The recurring cost was approved and the database/secrets foundation was
applied on 2026-08-13. It created:

- one private, encrypted, Single-AZ PostgreSQL 16.14 `db.t4g.micro` instance;
- three empty application Secrets Manager containers;
- three exact-secret read policies and one RDS bootstrap-secret read policy.

RDS generates and manages the master password; Terraform receives only its
secret ARN. No application secret versions are managed by Terraform. The final
post-apply plan returned `No changes`.

AWS Price List API rates checked for Sydney on 2026-08-13 were:

- `db.t4g.micro` Single-AZ PostgreSQL: USD 0.025/hour, approximately
  USD 18.25/month at 730 hours;
- Single-AZ PostgreSQL gp3 storage: USD 0.138/GiB-month, or USD 2.76/month for
  the initial 20 GiB;
- Secrets Manager: USD 0.40/secret-month, or approximately USD 1.60/month for
  the three runtime containers plus the RDS-managed master secret.

The Phase 3 idle increment is therefore approximately **USD 22.61/month**,
excluding API calls, backup storage beyond any included allocation, data
transfer, and tax. Together with the Phase 2 network baseline, the staging
foundation would consume approximately **USD 69.61/month** before ALB and
Fargate are added. These charges consume the account's Free plan credits.

The RDS resource has deletion protection and Terraform `prevent_destroy`.
Deletion requires an explicit two-step code review, disabling both safeguards,
and must retain the configured final snapshot.

The Directus schema source gate was resolved on 2026-08-14. The first staging
release pins Directus 11.14.1 and uses the deduplicated snapshot in the
`piggy-cms` repository. A disposable PostgreSQL 16 rehearsal verified the
health endpoint, administrator login, 31 application tables, and a read-only
`product_info` API request. The legacy sync tool must never run during normal
service startup. The bootstrap wrapper first checks for the application schema
and skips the sync when it is already present.

The manually created duplicate RDS instance `piggyway-staging-db` was deleted
on 2026-08-14. Its manual snapshot `piggyway-staging-db-snapshot` remains
available. Terraform continues to manage only `piggyway-staging-postgres`.

The Directus 11.14.1 deployment candidate was published from CMS commit
`ef601c8046dd446c8ba98af42dfb50457b426f90` as image digest
`sha256:fd26df4d6dc07c018209510a547302a8413e1791926cbece3db1a97b4b65aa14`.
The Dockerfile applies current Alpine security updates and includes the
checksum-verified AWS RDS Sydney CA bundle without changing the Directus
application version. ECR basic scanning completed with no findings. Earlier
pre-patch images remain in ECR for audit history and must not be selected by
any task definition.

The Backend staging bootstrap candidate was published from Backend commit
`1f353c839f9b9235ccb99c86663cf73cfafcff2b` as image digest
`sha256:9dd48002066dc49386c90aa1eb26773c150f4ca409171c1b357fea06ea4f33a9`.
The first candidate exposed outdated Alpine OpenSSL packages during ECR scan
and was not deployed. The final image applies the available Alpine security
updates and completed ECR basic scanning with no findings.

### Phase 3 database bootstrap result

Terraform owns five stopped-by-default, one-off Fargate task definitions and
their 14-day CloudWatch log group. They must be run in this order and must not
be converted into ECS services:

1. `piggyway-staging-database-users` creates or rotates the separate Directus
   and Backend database logins from Secrets Manager values.
2. `piggyway-staging-directus-schema` initializes Directus and applies the
   reviewed application schema.
3. `piggyway-staging-backend-schema` uses the Directus database owner to add
   only the missing product-detail fields and tables required by the current
   Backend. It never runs the inconsistent legacy Drizzle migration journal.
4. `piggyway-staging-database-permissions` grants the Backend login access to
   application tables and sequences only.
5. `piggyway-staging-backend-seed` uses the Backend login to upsert three
   synthetic staging products and variants without deleting existing rows.

The Directus task keeps PostgreSQL certificate verification enabled. It uses
the pinned Sydney RDS CA bundle through both `DB_SSL__CA_FILE` and
`NODE_EXTRA_CA_CERTS`. `DB_HEALTHCHECK_THRESHOLD=2000` prevents a small staging
RDS instance from rejecting the one-time schema apply during initial warm-up;
it does not disable the health check.

The AWS bootstrap completed on 2026-08-14. Successful task evidence is retained
in `/aws/ecs/piggyway-staging-database-bootstrap`:

- schema task `5ff3e91b829846b4a105f4dec429757e` exited `0` after Directus health,
  administrator login, and schema apply succeeded;
- permissions task `75897a2503584a4c8b56f06834e3f819` exited `0`;
- Backend-role verification task `adf64358bab34fd38b5ed612223d0ae1` exited
  `0` and returned `31|0|t`: 31 application tables, zero current
  `product_info` rows before staging seed, and an SSL database connection.
- product compatibility task `ac2b08c0c73941dab51760b6f4c1e6f9`, refreshed
  permissions task `38b97cb1c2994484a6a852f12df790a8`, and synthetic seed
  task `58daf0f2f2e646929a3edeb60d401628` all exited `0`;
- Backend code-level smoke task `3afc5ae00a2045ba8fa3d5cdb9a1714c` exited `0`
  and returned three staging products plus a readable detail record with one
  variant and one image.

Before AWS execution, the Backend schema and seed commands were each run twice
against a disposable PostgreSQL 16 database. The second run remained at three
products and three variants, while a pre-existing sentinel row remained
present. This verifies repeatability and the absence of broad cleanup logic.

Secret values were streamed directly into Secrets Manager and were not placed
in Terraform variables, state, plans, outputs, task logs, or Git. The Directus
and Backend containers now have secret versions; the Frontend secret container
remains empty until its runtime configuration is finalized.

The initial create attempt on 2026-08-13 was rejected before the DB instance
existed because AWS Free Plan does not permit the architecture's requested
seven-day automated backup retention. The recovery plan uses the account's
one-day maximum while retaining deletion protection and the mandatory final
snapshot. Upgrading the account should be followed by restoring the planned
seven-day retention. The three empty runtime secret containers and their
read-only IAM policies were created successfully by that first partial apply.
The reviewed recovery apply then completed with `2 added, 0 changed,
0 destroyed`: the RDS instance and its bootstrap-secret read policy.

## Directus service, ALB, DNS, and HTTPS

The first long-running application service was deployed on 2026-08-14 and its
public HTTPS route was completed on 2026-08-18.

- ECS maintains one private Fargate task for Directus with 0.25 vCPU and 1 GiB
  memory. The task has no public IP and pulls the immutable Directus image by
  digest.
- The execution role can pull only the Directus ECR repository, write only its
  CloudWatch log group, and read only the Directus runtime secret. The task
  role has no application permissions.
- `/aws/ecs/piggyway-staging-directus` retains application logs for 14 days.
- The internet-facing ALB accepts traffic only from the pinned Cloudflare IPv4
  ranges. Its IP target group checks `/server/health` on port 8055.
- Port 80 redirects to HTTPS. Port 443 uses the DNS-validated ACM certificate
  and forwards to the Directus target group.
- ECS deployment circuit breaking and rollback are enabled. The initial
  deployment reached a steady state with one running task and one healthy ALB
  target.

Cloudflare DNS is intentionally a documented manual step because Terraform
does not receive or store a Cloudflare API token. Create the ACM validation
CNAME records printed by `terraform output
staging_certificate_validation_options` as **DNS only** records. Keep them in
place for certificate renewal. Create this proxied application record:

```text
Type:   CNAME
Name:   cms-staging
Target: <terraform output -raw staging_alb_dns_name>
Proxy:  Proxied
TTL:    Auto
```

The first ACM request timed out before DNS ownership was available. Terraform
created a replacement after the validation records were added; it reached
`ISSUED` before the HTTPS listener was created. Do not hard-code the obsolete
certificate ARN in deployment commands.

Validate the public route without exposing credentials:

```bash
curl --fail --show-error --silent \
  https://cms-staging.piggyway.com.au/server/health
# Expected: {"status":"ok"}
```

The Directus login UI is available at
`https://cms-staging.piggyway.com.au/admin/login`. Retrieve the administrator
email and password from the `piggyway/staging/directus` secret through an
MFA-protected AWS session; never copy them into this repository or deployment
logs. Cloudflare Access and persistent Cloudinary storage remain follow-up
security and operations work.
