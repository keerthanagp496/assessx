package com.sentinelassess.repository;
import com.sentinelassess.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PracticeProgressRepository extends JpaRepository<PracticeProgress,Long>{
 Optional<PracticeProgress> findByUserIdAndPracticeQuestionId(Long userId,Long questionId);
 List<PracticeProgress> findByUserId(Long userId);
}
