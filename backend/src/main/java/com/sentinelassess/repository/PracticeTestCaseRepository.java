package com.sentinelassess.repository;
import com.sentinelassess.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PracticeTestCaseRepository extends JpaRepository<PracticeTestCase,Long>{
 List<PracticeTestCase> findByPracticeQuestionId(Long questionId);
}
