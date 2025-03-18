import React from "react";
import {
    TextField,
    Autocomplete,
    CircularProgress,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import { BookOpen } from "lucide-react";

function BookAutocomplete({
    books,
    selectedBook,
    loading,
    onQueryChange,
    onSelectedBookChange,
    onFetchMoreData,
}) {
    return (
        <div className="flex flex-col gap-1 justify-center items-center h-svh">
            <div>
                <BookOpen size={80} className="stroke-[0.7] stroke-blue-300 cursor-pointer" />
            </div>
            <div className="min-w-lg shadow-2xl">
                <Autocomplete
                    multiple 
                    freeSolo
                    disableCloseOnSelect 
                    options={books}
                    getOptionLabel={(option) => option?.title ? `${option.title} ` : option}
                    value={selectedBook || []} 
                    onChange={(event, newValue) => onSelectedBookChange(newValue)}
                    onInputChange={(event, newInputValue) => {
                        onQueryChange(newInputValue);
                    }}
                    groupBy={(option) => option.title} 
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="انتخاب کتاب"
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress size={24} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <ListItem {...props} key={option.key}>
                            <ListItemIcon>
                                <BookOpen />
                            </ListItemIcon>
                            <ListItemText primary={option.title}  />
                        </ListItem>
                    )}
                    ListboxProps={{
                        onScroll: (event) => {
                            const bottom =
                                event.target.scrollHeight - event.target.scrollTop ===
                                event.target.clientHeight;
                            if (bottom) {
                                onFetchMoreData();
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default BookAutocomplete;
