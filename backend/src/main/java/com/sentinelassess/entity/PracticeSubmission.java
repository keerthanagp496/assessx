package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="practice_submissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PracticeSubmission {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private User user;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private PracticeQuestion practiceQuestion;
 private String language;
 @Column(length=30000) private String code;
 private String status;
 private int passedTests;
 private int totalTests;
 private double runtime;
 private long memory;
 private int pointsAwarded;
 private LocalDateTime submittedAt;
 @PrePersist void pre(){submittedAt=LocalDateTime.now();}
}
