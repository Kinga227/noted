package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeekInDto {

    private Integer weekNumber;

    private Instant dateOfMonday;
}