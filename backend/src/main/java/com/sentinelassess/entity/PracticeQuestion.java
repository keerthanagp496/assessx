package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity @Table(name="practice_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PracticeQuestion {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String title;
 @Column(nullable=false,length=10000) private String description;
 private String category;
 private String subcategory;
 @Enumerated(EnumType.STRING) private Difficulty difficulty;
 private String language;
 @Column(length=10000) private String starterCode;
 @Column(length=5000) private String constraints;
 @Column(length=3000) private String inputFormat;
 @Column(length=3000) private String outputFormat;
 @Column(length=3000) private String sampleInput;
 @Column(length=3000) private String sampleOutput;
 @Column(length=5000) private String explanation;
 @Column(length=20000) private String referenceSolution;
 private boolean active=true;
 private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
 @PrePersist void pre(){createdAt=LocalDateTime.now();updatedAt=createdAt;}
 @PreUpdate void upd(){updatedAt=LocalDateTime.now();}
}
