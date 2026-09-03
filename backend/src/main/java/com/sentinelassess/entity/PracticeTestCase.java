package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="practice_test_cases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PracticeTestCase {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="practice_question_id") private PracticeQuestion practiceQuestion;
 @Column(length=10000) private String input;
 @Column(length=10000) private String expectedOutput;
 private boolean hidden;
 private int points;
}
