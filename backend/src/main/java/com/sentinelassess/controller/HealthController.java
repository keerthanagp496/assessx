package com.sentinelassess.controller;
import org.springframework.web.bind.annotation.*;
@RestController
public class HealthController {
 @GetMapping("/api/v1/health") public String health(){return "AssessX backend is running";}
}
