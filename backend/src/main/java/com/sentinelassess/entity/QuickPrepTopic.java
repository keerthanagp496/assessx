package com.sentinelassess.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quickprep_topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuickPrepTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String slug;

    @Column(length = 1000)
    private String summary;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String javaExample;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String rememberPoint;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String commonMistake;

    private String timeComplexity;
    private String spaceComplexity;

    @Builder.Default
    private int readTimeMinutes = 3;

    @Builder.Default
    private int displayOrder = 0;

    @Builder.Default
    private boolean active = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private QuickPrepCategory category;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuickPrepQuizQuestion> quizQuestions = new ArrayList<>();
}
