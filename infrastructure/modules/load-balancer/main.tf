resource "aws_lb" "this" {
  name                       = "${var.name_prefix}-alb"
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [var.security_group_id]
  subnets                    = var.public_subnet_ids
  enable_deletion_protection = false
  drop_invalid_header_fields = true
  idle_timeout               = 60
}

resource "aws_lb_target_group" "directus" {
  name                 = "${var.name_prefix}-directus"
  port                 = var.directus_port
  protocol             = "HTTP"
  protocol_version     = "HTTP1"
  target_type          = "ip"
  vpc_id               = var.vpc_id
  deregistration_delay = 30

  health_check {
    enabled             = true
    path                = "/server/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_acm_certificate" "staging" {
  domain_name               = var.certificate_domains[0]
  subject_alternative_names = slice(var.certificate_domains, 1, length(var.certificate_domains))
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Cloudflare owns the DNS records. This resource does not create or modify DNS;
# it waits until ACM observes the validation CNAMEs documented by the outputs.
resource "aws_acm_certificate_validation" "staging" {
  certificate_arn = aws_acm_certificate.staging.arn
  validation_record_fqdns = [
    for option in aws_acm_certificate.staging.domain_validation_options : option.resource_record_name
  ]
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06"
  certificate_arn   = aws_acm_certificate_validation.staging.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.directus.arn
  }
}
