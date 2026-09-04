package com.sentinelassess.repository;

import com.sentinelassess.entity.QuickPrepCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuickPrepCategoryRepository extends JpaRepository<QuickPrepCategory, Long> {
    Optional<QuickPrepCategory> findBySlug(String slug);
    Optional<QuickPrepCategory> findByName(String name);
    List<QuickPrepCategory> findAllByOrderByDisplayOrderAsc();
}
