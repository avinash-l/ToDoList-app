package com.app.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ApiResponseDto {
	private String message;
	private LocalDateTime timeStamp;

	public ApiResponseDto(String message) {
		super();
		this.message = message;
		this.timeStamp = LocalDateTime.now();
	}

}
