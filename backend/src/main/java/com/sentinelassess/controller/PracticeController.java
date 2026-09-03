package com.sentinelassess.controller;

import com.sentinelassess.dto.PracticeDtos.*;
import com.sentinelassess.entity.PracticeQuestion;
import com.sentinelassess.service.PracticeService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/practice")
public class PracticeController {
 private final PracticeService service;
 public PracticeController(PracticeService s){service=s;}

  @GetMapping("/questions") public List<Map<String,Object>> list(){
    return service.list().stream().map(this::toMap).toList();
  }
  @GetMapping("/questions/{id}") public Map<String,Object> get(@PathVariable Long id){
    PracticeQuestion q=service.get(id);
    return toMap(q);
  }

  private Map<String,Object> toMap(PracticeQuestion q){
    Map<String,Object> m = new LinkedHashMap<>();
    m.put("id", q.getId());
    m.put("title", q.getTitle());
    m.put("description", q.getDescription());
    m.put("category", q.getCategory());
    m.put("subcategory", q.getSubcategory());
    m.put("difficulty", q.getDifficulty());
    m.put("language", q.getLanguage());
    m.put("starterCode", q.getStarterCode());
    m.put("constraints", q.getConstraints());
    m.put("inputFormat", q.getInputFormat());
    m.put("outputFormat", q.getOutputFormat());
    m.put("sampleInput", q.getSampleInput());
    m.put("sampleOutput", q.getSampleOutput());
    m.put("explanation", q.getExplanation());
    m.put("active", q.isActive());
    return m;
  }
 @PostMapping("/questions/{id}/run") public RunResponse run(@PathVariable Long id,@RequestBody RunRequest r){return service.run(id,r);}
 @PostMapping("/questions/{id}/submit") public Map<String,Object> submit(@PathVariable Long id,@RequestParam Long userId,@RequestBody RunRequest r){return service.submit(id,userId,r);}
}
