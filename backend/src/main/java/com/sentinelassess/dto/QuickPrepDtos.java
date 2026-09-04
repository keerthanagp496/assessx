package com.sentinelassess.dto;

import lombok.*;
import java.util.List;

public class QuickPrepDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProgressRequest {
        private Long userId;
        private Long topicId;
        private boolean completed;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BookmarkRequest {
        private Long userId;
        private Long topicId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class QuizAnswerDto {
        private Long questionId;
        private String selectedOption;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class QuizSubmissionRequest {
        private Long userId;
        private Long topicId;
        private List<QuizAnswerDto> answers;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class QuizResultResponse {
        private int total;
        private int score;
        private double percentage;
        private List<String> strongTopics;
        private List<String> weakTopics;
        private List<String> recommendations;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RevisionPathScheduleItem {
        private String timeStamp;
        private Long topicId;
        private String title;
        private String category;
        private int durationMinutes;
        private String summary;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RevisionPathDto {
        private String duration;
        private String title;
        private int totalMinutes;
        private String description;
        private List<RevisionPathScheduleItem> schedule;
    }
}
