package com.sentinelassess.service;

import com.sentinelassess.dto.AssessmentDto.*;
import com.sentinelassess.entity.*;
import com.sentinelassess.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssessmentService {
    private final AssessmentRepository assessments;
    private final AssessmentSubmissionRepository submissions;
    private final UserRepository users;

    public AssessmentService(AssessmentRepository assessments,
                             AssessmentSubmissionRepository submissions,
                             UserRepository users) {
        this.assessments = assessments;
        this.submissions = submissions;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<AssessmentSummary> getAllPublished() {
        return assessments.findAll().stream()
                .filter(Assessment::isPublished)
                .map(a -> {
                    int totalMarks = a.getQuestions().stream().mapToInt(AssessmentQuestion::getMarks).sum();
                    return new AssessmentSummary(
                            a.getId(),
                            a.getTitle(),
                            a.getDescription(),
                            a.getDurationMinutes(),
                            a.isPublished(),
                            a.getQuestions().size(),
                            totalMarks
                    );
                }).toList();
    }

    @Transactional(readOnly = true)
    public AssessmentDetail getById(Long id) {
        Assessment a = assessments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found: " + id));

        int totalMarks = a.getQuestions().stream().mapToInt(AssessmentQuestion::getMarks).sum();
        List<QuestionDetail> qDetails = a.getQuestions().stream()
                .map(q -> new QuestionDetail(
                        q.getId(),
                        q.getType(),
                        q.getTitle(),
                        q.getDescription(),
                        q.getMarks(),
                        q.getStarterCode(),
                        q.getReferenceSolution(),
                        q.getOptionsJson(),
                        q.getCorrectOption()
                )).toList();

        return new AssessmentDetail(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getDurationMinutes(),
                a.isPublished(),
                totalMarks,
                qDetails
        );
    }

    @Transactional
    public SubmissionResponse submitAssessment(Long id, Long userId, SubmitRequest req) {
        Assessment a = assessments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found: " + id));
        User u = users.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        int totalMarks = a.getQuestions().stream().mapToInt(AssessmentQuestion::getMarks).sum();

        // If violations >= 10, ensure status is TERMINATED_VIOLATIONS and score is 0
        String status = req.status();
        int finalScore = req.score();
        if (req.violationCount() >= 10 || "TERMINATED_VIOLATIONS".equalsIgnoreCase(status)) {
            status = "TERMINATED_VIOLATIONS";
            finalScore = 0;
        } else if (status == null || status.isBlank()) {
            status = "COMPLETED";
        }

        AssessmentSubmission sub = AssessmentSubmission.builder()
                .assessment(a)
                .user(u)
                .score(finalScore)
                .maxMarks(totalMarks)
                .violationCount(req.violationCount())
                .status(status)
                .violationsLog(req.violationsLog() != null ? req.violationsLog() : "[]")
                .answersJson(req.answersJson() != null ? req.answersJson() : "{}")
                .build();

        AssessmentSubmission saved = submissions.save(sub);

        return new SubmissionResponse(
                saved.getId(),
                a.getId(),
                a.getTitle(),
                saved.getScore(),
                saved.getMaxMarks(),
                saved.getViolationCount(),
                saved.getStatus(),
                saved.getViolationsLog(),
                saved.getSubmittedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getUserSubmissions(Long userId) {
        return submissions.findByUserIdOrderByIdDesc(userId).stream()
                .map(s -> new SubmissionResponse(
                        s.getId(),
                        s.getAssessment().getId(),
                        s.getAssessment().getTitle(),
                        s.getScore(),
                        s.getMaxMarks(),
                        s.getViolationCount(),
                        s.getStatus(),
                        s.getViolationsLog(),
                        s.getSubmittedAt()
                )).toList();
    }
}
