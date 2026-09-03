package com.sentinelassess.controller;
import com.sentinelassess.dto.AuthDtos.*;
import com.sentinelassess.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
 private final AuthService service;
 public AuthController(AuthService s){service=s;}
 @PostMapping("/register") public AuthResponse register(@RequestBody RegisterRequest r){return service.register(r);}
 @PostMapping("/login") public AuthResponse login(@RequestBody LoginRequest r){return service.login(r);}
}
