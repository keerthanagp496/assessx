package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="assessment_submissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssessmentSubmission {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private User user;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private Assessment assessment;
 private int score;
 private int maxMarks;
 private int violationCount;
 private String status; // COMPLETED, TERMINATED_VIOLATIONS, TIMED_OUT
 @Column(length=10000) private String violationsLog;
 @Column(length=20000) private String answersJson;
 private LocalDateTime submittedAt;
 @PrePersist void pre(){submittedAt=LocalDateTime.now();}
}
