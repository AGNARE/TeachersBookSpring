package com.agn.web.dto;

public record AuthResponse(String token, String username, String role) {
}
