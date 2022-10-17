import secrets

def generate_random_string(length = 8):
    return secrets.token_urlsafe(length)