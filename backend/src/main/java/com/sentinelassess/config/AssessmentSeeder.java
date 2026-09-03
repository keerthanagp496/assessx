package com.sentinelassess.config;

import com.sentinelassess.entity.*;
import com.sentinelassess.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;

@Configuration
public class AssessmentSeeder {
 @Bean CommandLineRunner seedAssessment(AssessmentRepository a,AssessmentQuestionRepository q){
  return args->{
   if(a.count()>0)return;
   Assessment x=Assessment.builder().title("Java Fundamentals Demo").description("Demo assessment kept separate from Practice Arena.").durationMinutes(30).published(true).build();
   a.save(x);
   q.save(AssessmentQuestion.builder().assessment(x).type("MCQ").title("What is JVM?").description("Choose the best answer.").marks(2).build());
  };
 }
}
