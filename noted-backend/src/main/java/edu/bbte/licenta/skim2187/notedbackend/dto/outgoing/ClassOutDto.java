package edu.bbte.licenta.skim2187.notedbackend.dto.outgoing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassOutDto {

    private Long id;

    private Integer weekType;

    private Integer weekDayNumber;

    private String startHour;

    private Long classTypeId;

    private Long subjectId;

    private String teacherName;

    private String location;
}
