terraform {
  backend "s3" {
    key          = "piggyway/staging/core/terraform.tfstate"
    region       = "ap-southeast-2"
    encrypt      = true
    use_lockfile = true
  }
}

