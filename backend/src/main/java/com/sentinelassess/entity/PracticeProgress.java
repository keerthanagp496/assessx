package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="practice_progress",
 uniqueConstraints=@UniqueConstraint(columnNames={"user_id","practice_question_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PracticeProgress {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private User user;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private PracticeQuestion practiceQuestion;
 private boolean solved;
 private int attempts;
 private double bestRuntime;
 private int pointsEarned;
 private LocalDateTime lastSubmittedAt;
}
