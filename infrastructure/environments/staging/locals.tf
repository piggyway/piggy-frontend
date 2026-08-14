locals {
  default_tags = {
    Project     = "piggyway"
    Environment = "staging"
    ManagedBy   = "terraform"
  }

  existing_public_subnets = {
    ap-southeast-2a = {
      cidr_block        = "10.20.0.0/20"
      availability_zone = "ap-southeast-2a"
      name              = "piggyway-staging-subnet-public1-ap-southeast-2a"
    }
    ap-southeast-2b = {
      cidr_block        = "10.20.16.0/20"
      availability_zone = "ap-southeast-2b"
      name              = "piggyway-staging-subnet-public2-ap-southeast-2b"
    }
  }

  existing_app_subnets = {
    ap-southeast-2a = {
      cidr_block        = "10.20.128.0/20"
      availability_zone = "ap-southeast-2a"
      name              = "piggyway-staging-subnet-private1-ap-southeast-2a"
    }
    ap-southeast-2b = {
      cidr_block        = "10.20.144.0/20"
      availability_zone = "ap-southeast-2b"
      name              = "piggyway-staging-subnet-private2-ap-southeast-2b"
    }
  }

  database_subnets = {
    ap-southeast-2a = {
      cidr_block        = "10.20.32.0/24"
      availability_zone = "ap-southeast-2a"
      name              = "piggyway-staging-subnet-database1-ap-southeast-2a"
    }
    ap-southeast-2b = {
      cidr_block        = "10.20.33.0/24"
      availability_zone = "ap-southeast-2b"
      name              = "piggyway-staging-subnet-database2-ap-southeast-2b"
    }
  }

  # Pinned from https://api.cloudflare.com/client/v4/ips on 2026-08-12.
  cloudflare_ipv4_cidrs = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
  ]

  existing_security_groups = {
    alb = {
      name        = "piggyway-staging-alb-sg"
      description = "Staging ALB security group"
    }
    frontend = {
      name        = "piggyway-staging-frontend-sg"
      description = "Staging frontend ECS security group"
    }
    backend = {
      name        = "piggyway-staging-backend-sg"
      description = "Staging backend ECS security group"
    }
    directus = {
      name        = "piggyway-staging-directus-sg"
      description = "Staging Directus ECS security group"
    }
    rds = {
      name        = "piggyway-staging-rds-sg"
      description = "Staging PostgreSQL RDS security group"
    }
  }
}
