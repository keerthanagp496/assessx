package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="assessment_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssessmentQuestion {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private Assessment assessment;
 private String type; // "CODING" or "MCQ"
 private String title;
 @Column(length=10000) private String description;
 private int marks;
 @Column(length=20000) private String referenceSolution;
 @Column(length=10000) private String starterCode;
 @Column(length=5000) private String optionsJson; // JSON array of options e.g. ["Option A", "Option B", ...]
 private String correctOption; // e.g. "A" or "0"
}
