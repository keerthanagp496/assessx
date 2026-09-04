package com.sentinelassess.repository;

import com.sentinelassess.entity.QuickPrepTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface QuickPrepTopicRepository extends JpaRepository<QuickPrepTopic, Long> {
    List<QuickPrepTopic> findByActiveTrueOrderByDisplayOrderAsc();
    List<QuickPrepTopic> findByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(Long categoryId);
    List<QuickPrepTopic> findByCategory_SlugAndActiveTrueOrderByDisplayOrderAsc(String slug);
    List<QuickPrepTopic> findAllByOrderByDisplayOrderAsc();
    Optional<QuickPrepTopic> findBySlug(String slug);

    @Query("SELECT t FROM QuickPrepTopic t WHERE t.active = true AND " +
           "(LOWER(t.title) LIKE :pattern OR " +
           " LOWER(t.summary) LIKE :pattern OR " +
           " (t.category IS NOT NULL AND LOWER(t.category.name) LIKE :pattern)) " +
           "ORDER BY t.displayOrder ASC")
    List<QuickPrepTopic> searchTopics(@Param("pattern") String pattern);
}
