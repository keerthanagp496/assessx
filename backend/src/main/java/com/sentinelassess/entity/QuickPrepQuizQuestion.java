package com.sentinelassess.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quickprep_quiz_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuickPrepQuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonIgnore
    private QuickPrepTopic topic;

    @Column(nullable = false, length = 1000)
    private String question;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String optionsJson;

    @Column(nullable = false)
    private String correctOption;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Builder.Default
    private String questionType = "MCQ";
}
