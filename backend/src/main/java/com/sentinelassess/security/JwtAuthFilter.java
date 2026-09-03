package com.sentinelassess.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
 private final JwtService jwt;
 public JwtAuthFilter(JwtService jwt){this.jwt=jwt;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
   String h=req.getHeader("Authorization");
   if(h!=null&&h.startsWith("Bearer ")){
     String token=h.substring(7);
     try{
       String email=jwt.email(token);
       Claims claims=Jwts.parser().verifyWith(jwt.key()).build().parseSignedClaims(token).getPayload();
       String role=claims.get("role",String.class);
       var auth=new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority(role)));
       SecurityContextHolder.getContext().setAuthentication(auth);
     }catch(Exception ignored){}
   }
   chain.doFilter(req,res);
 }
}
