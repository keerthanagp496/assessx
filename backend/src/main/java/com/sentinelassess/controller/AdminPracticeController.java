package com.sentinelassess.controller;

import com.sentinelassess.entity.*;
import com.sentinelassess.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/practice/admin")
public class AdminPracticeController {
 private final PracticeQuestionRepository q; private final PracticeTestCaseRepository t;
 public AdminPracticeController(PracticeQuestionRepository q,PracticeTestCaseRepository t){this.q=q;this.t=t;}
 @GetMapping("/questions") public List<PracticeQuestion> all(){return q.findAll();}
 @PostMapping("/questions") public PracticeQuestion create(@RequestBody PracticeQuestion x){x.setId(null);return q.save(x);}
 @PutMapping("/questions/{id}") public PracticeQuestion update(@PathVariable Long id,@RequestBody PracticeQuestion x){
   x.setId(id);return q.save(x);
 }
 @DeleteMapping("/questions/{id}") public void delete(@PathVariable Long id){q.deleteById(id);}
 @PatchMapping("/questions/{id}/active") public PracticeQuestion active(@PathVariable Long id,@RequestParam boolean value){
   PracticeQuestion x=q.findById(id).orElseThrow();x.setActive(value);return q.save(x);
 }
 @PostMapping("/questions/{id}/test-cases") public PracticeTestCase addTest(@PathVariable Long id,@RequestBody PracticeTestCase x){
   x.setId(null);x.setPracticeQuestion(q.findById(id).orElseThrow());return t.save(x);
 }
}
