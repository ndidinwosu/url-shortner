package com.shortking.shortUrl.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
public class DefaultController {

    @Operation(summary = "Read root", description = "Default page")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            value = "{\n" +
                                                    "  \"string\": \"string\"\n" +
                                                    "}"
                                    )
                            }
                    )
            )
    })
    @GetMapping("/")
    public ResponseEntity<String> readRoot() {
        return ResponseEntity.ok("read root"); // ask frontend team if this is what they meant???
    }
}