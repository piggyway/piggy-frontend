# Known resources created manually before Terraform adoption. Imports do not run
# until a reviewed `terraform plan` is applied.

import {
  to = module.network.aws_vpc.this
  id = "vpc-0553d64290afe97c5"
}

import {
  to = module.network.aws_subnet.public["ap-southeast-2a"]
  id = "subnet-0c3ae81bf47f43c4f"
}

import {
  to = module.network.aws_subnet.public["ap-southeast-2b"]
  id = "subnet-0adfa22c0f73b3ec2"
}

import {
  to = module.network.aws_subnet.app["ap-southeast-2a"]
  id = "subnet-03652988a3ebc74a7"
}

import {
  to = module.network.aws_subnet.app["ap-southeast-2b"]
  id = "subnet-007fe7faf9c5964b5"
}

import {
  to = module.network.aws_security_group.this["alb"]
  id = "sg-04740bb56e3706a7d"
}

import {
  to = module.network.aws_security_group.this["frontend"]
  id = "sg-0fbf8c04c8dfee2fc"
}

import {
  to = module.network.aws_security_group.this["backend"]
  id = "sg-02e243d296eabcb60"
}

import {
  to = module.network.aws_security_group.this["directus"]
  id = "sg-022d0e077f3dd96b9"
}

import {
  to = module.network.aws_security_group.this["rds"]
  id = "sg-08369e0ed2b42e62e"
}

import {
  to = module.ecr.aws_ecr_repository.this["frontend"]
  id = "piggyway-staging-frontend"
}

import {
  to = module.ecr.aws_ecr_repository.this["backend"]
  id = "piggyway-staging-backend"
}

import {
  to = module.ecr.aws_ecr_repository.this["directus"]
  id = "piggyway-staging-directus"
}

import {
  to = aws_ecs_cluster.this
  id = "piggyway-staging"
}

import {
  to = module.database.aws_db_subnet_group.this
  id = "piggyway-staging-db-subnet-group"
}

import {
  to = module.network.aws_internet_gateway.this
  id = "igw-09188bb8b15984cc5"
}

import {
  to = module.network.aws_route_table.public
  id = "rtb-09d4fd9d34b7f3a45"
}

import {
  to = module.network.aws_route_table.app["ap-southeast-2a"]
  id = "rtb-05af7bda3b5584ca2"
}

import {
  to = module.network.aws_route_table.app["ap-southeast-2b"]
  id = "rtb-04fa443c7f68b0e4d"
}

import {
  to = module.network.aws_default_route_table.this
  id = "vpc-0553d64290afe97c5"
}

import {
  to = module.network.aws_route.public_internet
  id = "rtb-09d4fd9d34b7f3a45_0.0.0.0/0"
}

import {
  to = module.network.aws_route_table_association.public["ap-southeast-2a"]
  id = "subnet-0c3ae81bf47f43c4f/rtb-09d4fd9d34b7f3a45"
}

import {
  to = module.network.aws_route_table_association.public["ap-southeast-2b"]
  id = "subnet-0adfa22c0f73b3ec2/rtb-09d4fd9d34b7f3a45"
}

import {
  to = module.network.aws_route_table_association.app["ap-southeast-2a"]
  id = "subnet-03652988a3ebc74a7/rtb-05af7bda3b5584ca2"
}

import {
  to = module.network.aws_route_table_association.app["ap-southeast-2b"]
  id = "subnet-007fe7faf9c5964b5/rtb-04fa443c7f68b0e4d"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["alb_http"]
  id = "sgr-0689706373ba2e7df"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["alb_https"]
  id = "sgr-0df15acdd1ad006f5"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["frontend_from_alb"]
  id = "sgr-054a47e2c1d3de021"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["backend_from_alb"]
  id = "sgr-0882708a21df2bb50"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["backend_from_frontend"]
  id = "sgr-0bafee74712b57eb2"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["directus_from_alb"]
  id = "sgr-07e9ffb86073175c1"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["rds_from_backend"]
  id = "sgr-00a578ec2438976b5"
}

import {
  to = module.network.aws_vpc_security_group_ingress_rule.this["rds_from_directus"]
  id = "sgr-0a09a3f6171f9ff5b"
}

import {
  to = module.network.aws_vpc_security_group_egress_rule.all_ipv4["alb"]
  id = "sgr-093c9c7cf44b9ef54"
}

import {
  to = module.network.aws_vpc_security_group_egress_rule.all_ipv4["frontend"]
  id = "sgr-0816b2022fdf45bb1"
}

import {
  to = module.network.aws_vpc_security_group_egress_rule.all_ipv4["backend"]
  id = "sgr-02ed62b652b0ec17e"
}

import {
  to = module.network.aws_vpc_security_group_egress_rule.all_ipv4["directus"]
  id = "sgr-024aaad0cef7954bc"
}

import {
  to = module.network.aws_vpc_security_group_egress_rule.all_ipv4["rds"]
  id = "sgr-08995279707019f3f"
}
