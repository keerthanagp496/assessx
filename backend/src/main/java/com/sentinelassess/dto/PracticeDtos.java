package com.sentinelassess.dto;
public final class PracticeDtos {
 private PracticeDtos(){}
 public record RunRequest(String language,String code){}
 public record RunResponse(String status,String stdout,String stderr,double time,long memory){}
}
