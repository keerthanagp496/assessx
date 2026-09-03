package com.sentinelassess.repository;
import com.sentinelassess.entity.AssessmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentSubmissionRepository extends JpaRepository<AssessmentSubmission,Long>{
    List<AssessmentSubmission> findByUserIdOrderByIdDesc(Long userId);
}
