package com.sentinelassess.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String email;
 @Column(nullable=false) private String password;
 @Column(nullable=false) private String username;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
 private LocalDateTime createdAt;
 @PrePersist void prePersist(){ if(createdAt==null) createdAt=LocalDateTime.now(); }
}
