resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  instance_tenancy     = "default"

  tags = {
    Name = "${var.name_prefix}-vpc"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_subnet" "public" {
  for_each = var.public_subnets

  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value.cidr_block
  availability_zone       = each.value.availability_zone
  map_public_ip_on_launch = false

  tags = {
    Name = each.value.name
    Tier = "public"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_subnet" "app" {
  for_each = var.app_subnets

  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value.cidr_block
  availability_zone       = each.value.availability_zone
  map_public_ip_on_launch = false

  tags = {
    Name = each.value.name
    Tier = "application"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_subnet" "database" {
  for_each = var.database_subnets

  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value.cidr_block
  availability_zone       = each.value.availability_zone
  map_public_ip_on_launch = false

  tags = {
    Name = each.value.name
    Tier = "database"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_security_group" "this" {
  for_each = var.security_groups

  name        = each.value.name
  description = each.value.description
  vpc_id      = aws_vpc.this.id

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.name_prefix}-igw"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.name_prefix}-rtb-public"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route_table" "app" {
  for_each = var.app_subnets

  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.name_prefix}-rtb-${each.key == "ap-southeast-2a" ? "private1" : "private2"}-${each.key}"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route_table" "database" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.name_prefix}-rtb-database"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_default_route_table" "this" {
  default_route_table_id = aws_vpc.this.default_route_table_id

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${var.name_prefix}-nat-eip"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_nat_gateway" "this" {
  allocation_id     = aws_eip.nat.id
  connectivity_type = "public"
  subnet_id         = aws_subnet.public["ap-southeast-2a"].id

  tags = {
    Name = "${var.name_prefix}-nat"
  }

  depends_on = [aws_internet_gateway.this]

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route" "app_internet" {
  for_each = aws_route_table.app

  route_table_id         = each.value.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.this.id
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "app" {
  for_each = aws_subnet.app

  subnet_id      = each.value.id
  route_table_id = aws_route_table.app[each.key].id
}

resource "aws_route_table_association" "database" {
  for_each = aws_subnet.database

  subnet_id      = each.value.id
  route_table_id = aws_route_table.database.id
}

locals {
  cloudflare_ingress_rules = merge(
    {
      alb_http = {
        security_group = "alb"
        from_port      = 80
        to_port        = 80
        cidr_ipv4      = var.cloudflare_ipv4_cidrs[0]
        source_group   = null
      }
      alb_https = {
        security_group = "alb"
        from_port      = 443
        to_port        = 443
        cidr_ipv4      = var.cloudflare_ipv4_cidrs[0]
        source_group   = null
      }
    },
    merge([
      for index, cidr in slice(var.cloudflare_ipv4_cidrs, 1, length(var.cloudflare_ipv4_cidrs)) : {
        "alb_http_${index + 1}" = {
          security_group = "alb"
          from_port      = 80
          to_port        = 80
          cidr_ipv4      = cidr
          source_group   = null
        }
        "alb_https_${index + 1}" = {
          security_group = "alb"
          from_port      = 443
          to_port        = 443
          cidr_ipv4      = cidr
          source_group   = null
        }
      }
    ]...)
  )

  service_ingress_rules = {
    frontend_from_alb = {
      security_group = "frontend"
      from_port      = 3000
      to_port        = 3000
      cidr_ipv4      = null
      source_group   = "alb"
    }
    backend_from_alb = {
      security_group = "backend"
      from_port      = 3000
      to_port        = 3000
      cidr_ipv4      = null
      source_group   = "alb"
    }
    backend_from_frontend = {
      security_group = "backend"
      from_port      = 3000
      to_port        = 3000
      cidr_ipv4      = null
      source_group   = "frontend"
    }
    directus_from_alb = {
      security_group = "directus"
      from_port      = 8055
      to_port        = 8055
      cidr_ipv4      = null
      source_group   = "alb"
    }
    rds_from_backend = {
      security_group = "rds"
      from_port      = 5432
      to_port        = 5432
      cidr_ipv4      = null
      source_group   = "backend"
    }
    rds_from_directus = {
      security_group = "rds"
      from_port      = 5432
      to_port        = 5432
      cidr_ipv4      = null
      source_group   = "directus"
    }
    rds_from_migration = {
      security_group = "rds"
      from_port      = 5432
      to_port        = 5432
      cidr_ipv4      = null
      source_group   = "migration"
    }
  }

  ingress_rules = merge(local.cloudflare_ingress_rules, local.service_ingress_rules)
}

resource "aws_vpc_security_group_ingress_rule" "this" {
  for_each = local.ingress_rules

  security_group_id            = aws_security_group.this[each.value.security_group].id
  cidr_ipv4                    = each.value.cidr_ipv4
  referenced_security_group_id = each.value.source_group == null ? null : aws_security_group.this[each.value.source_group].id
  from_port                    = each.value.from_port
  ip_protocol                  = "tcp"
  to_port                      = each.value.to_port
}

resource "aws_vpc_security_group_egress_rule" "all_ipv4" {
  for_each = aws_security_group.this

  security_group_id = each.value.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = "piggyway-staging.local"
  description = "Private service discovery namespace for Piggyway staging"
  vpc         = aws_vpc.this.id
}

resource "aws_service_discovery_service" "backend" {
  name = "backend"

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.this.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

}
