package com.sentinelassess.repository;
import com.sentinelassess.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PracticeSubmissionRepository extends JpaRepository<PracticeSubmission,Long>{
 List<PracticeSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId);
}
