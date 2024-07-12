package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ExamInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ExamOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ExamMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Exam mapToEntity(ExamInDto createRequestDto);

    public abstract ExamOutDto mapToDto(Exam createRequest);
}
