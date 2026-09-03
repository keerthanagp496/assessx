package com.sentinelassess.controller;

import com.sentinelassess.dto.AssessmentDto.*;
import com.sentinelassess.service.AssessmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {
    private final AssessmentService service;

    public AssessmentController(AssessmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<AssessmentSummary> list() {
        return service.getAllPublished();
    }

    @GetMapping("/{id}")
    public AssessmentDetail get(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping("/{id}/submit")
    public SubmissionResponse submit(@PathVariable Long id,
                                     @RequestParam Long userId,
                                     @RequestBody SubmitRequest req) {
        return service.submitAssessment(id, userId, req);
    }

    @GetMapping("/submissions/my")
    public List<SubmissionResponse> mySubmissions(@RequestParam Long userId) {
        return service.getUserSubmissions(userId);
    }
}
