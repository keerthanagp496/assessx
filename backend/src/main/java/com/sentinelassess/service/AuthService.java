package com.sentinelassess.service;

import com.sentinelassess.dto.AuthDtos.*;
import com.sentinelassess.entity.*;
import com.sentinelassess.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sentinelassess.security.JwtService;

@Service
public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
 public AuthResponse register(RegisterRequest r){
   if(users.findByEmail(r.email()).isPresent()) throw new IllegalArgumentException("Email already registered");
   User u=User.builder().username(r.username()).email(r.email()).password(encoder.encode(r.password())).role(Role.ROLE_STUDENT).build();
   users.save(u); return new AuthResponse(u.getId(),jwt.generate(u.getEmail(),u.getRole().name()),u.getUsername(),u.getRole().name());
 }
 public AuthResponse login(LoginRequest r){
   User u=users.findByEmail(r.email()).orElseThrow(()->new IllegalArgumentException("Invalid credentials"));
   if(!encoder.matches(r.password(),u.getPassword())) throw new IllegalArgumentException("Invalid credentials");
   return new AuthResponse(u.getId(),jwt.generate(u.getEmail(),u.getRole().name()),u.getUsername(),u.getRole().name());
 }
}
