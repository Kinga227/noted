package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassInDto {

    @NotNull
    private Integer weekType;

    @NotNull
    private Integer weekDayNumber;

    @NotNull
    private String startHour;

    @NotNull
    private Long classTypeId;

    @NotNull
    private Long subjectId;

    private String teacherName;

    private String location;

    @Override
    public String toString() {
        return "ClassInDto{" +
                "weekType=" + weekType +
                ", weekDayNumber=" + weekDayNumber +
                ", startHour='" + startHour + '\'' +
                ", classTypeId=" + classTypeId +
                ", subjectId=" + subjectId +
                ", teacherName='" + teacherName + '\'' +
                ", location='" + location + '\'' +
                '}';
    }
}
