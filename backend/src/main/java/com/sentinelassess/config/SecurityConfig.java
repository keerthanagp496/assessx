package com.sentinelassess.config;

import com.sentinelassess.security.JwtAuthFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwt)throws Exception{
   http.csrf(c->c.disable()).cors(c->c.configurationSource(cors()))
      .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(a->a
       .requestMatchers("/api/v1/auth/**","/api/v1/health","/h2-console/**").permitAll()
       .requestMatchers("/api/v1/practice/admin/**").hasRole("ADMIN")
       .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
       .anyRequest().authenticated())
      .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class)
      .headers(h->h.frameOptions(f->f.sameOrigin()));
   return http.build();
 }
 @Bean CorsConfigurationSource cors(){
   CorsConfiguration c=new CorsConfiguration();
   c.setAllowedOriginPatterns(List.of("*"));
   c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
   c.setAllowedHeaders(List.of("*"));
   c.setAllowCredentials(true);
   UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();
   s.registerCorsConfiguration("/**",c);
   return s;
 }
}
