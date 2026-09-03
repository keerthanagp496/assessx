package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Table(name="assessments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Assessment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String title;
 @Column(length=5000) private String description;
 private int durationMinutes;
 private boolean published;
 @Builder.Default
 @OneToMany(mappedBy="assessment",cascade=CascadeType.ALL,orphanRemoval=true)
 private List<AssessmentQuestion> questions=new ArrayList<>();
}
