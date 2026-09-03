package com.sentinelassess.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentDto {
    public record AssessmentSummary(
        Long id,
        String title,
        String description,
        int durationMinutes,
        boolean published,
        int totalQuestions,
        int totalMarks
    ) {}

    public record AssessmentDetail(
        Long id,
        String title,
        String description,
        int durationMinutes,
        boolean published,
        int totalMarks,
        List<QuestionDetail> questions
    ) {}

    public record QuestionDetail(
        Long id,
        String type,
        String title,
        String description,
        int marks,
        String starterCode,
        String referenceSolution,
        String optionsJson,
        String correctOption
    ) {}

    public record SubmitRequest(
        int violationCount,
        String status,
        String violationsLog,
        String answersJson,
        int score
    ) {}

    public record SubmissionResponse(
        Long id,
        Long assessmentId,
        String assessmentTitle,
        int score,
        int maxMarks,
        int violationCount,
        String status,
        String violationsLog,
        LocalDateTime submittedAt
    ) {}
}
