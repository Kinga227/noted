package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.NoteInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.NoteOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class NoteMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Note mapToEntity(NoteInDto createRequestDto);

    public abstract NoteOutDto mapToDto(Note createRequest);
}
