package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ExamWeekInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ExamWeekOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.ExamWeek;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ExamWeekMapper {

    @Mapping(target = "id", ignore = true)
    public abstract ExamWeek mapToEntity(ExamWeekInDto createRequestDto);

    public abstract ExamWeekOutDto mapToDto(ExamWeek createRequest);
}
