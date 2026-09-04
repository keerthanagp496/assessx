package com.sentinelassess.repository;

import com.sentinelassess.entity.QuickPrepProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuickPrepProgressRepository extends JpaRepository<QuickPrepProgress, Long> {
    List<QuickPrepProgress> findByUserId(Long userId);
    Optional<QuickPrepProgress> findByUserIdAndTopicId(Long userId, Long topicId);
    long countByUserIdAndCompletedTrue(Long userId);
}
