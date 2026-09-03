package com.sentinelassess.dto;
public final class AuthDtos {
 private AuthDtos(){}
 public record RegisterRequest(String username,String email,String password){}
 public record LoginRequest(String email,String password){}
 public record AuthResponse(Long id,String token,String username,String role){}
}
