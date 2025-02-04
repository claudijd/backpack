import { useContext, useMemo } from "react";
import { RichMentionsContext, RichMentionsInput } from "react-rich-mentions";
import { useUsersMetadata } from "@coral-xyz/react-common";
import { styles, useCustomTheme } from "@coral-xyz/themes";
import { CircularProgress, Hidden } from "@mui/material";

import { useChatContext } from "../ChatContext";

const useStyles = styles((themes) => ({
  input: {
    "&:hover": {
      cursor: "text",
    },
  },
}));

export function MessageInput({ setEmojiMenuOpen }: { setEmojiMenuOpen: any }) {
  const defaultValue = "";
  const classes = useStyles();
  const theme = useCustomTheme();
  const { type, remoteUsername, activeReply } = useChatContext();
  const { activeSearch } = useContext(RichMentionsContext);

  return (
    <div style={{ width: "100%", padding: 10 }}>
      <RichMentionsInput
        onKeyDown={(event) => {
          if (event.key === "Enter" && activeSearch) {
            event.stopPropagation();
          }
        }}
        className={classes.input}
        onClick={() => setEmojiMenuOpen(false)}
        placeholder={
          type === "individual"
            ? `Message @${remoteUsername}`
            : activeReply?.parent_username
            ? "Reply"
            : "Write a message..."
        }
        style={{
          outline: "0px solid transparent",
          color: theme.custom.colors.fontColor,
          fontSize: "15px",
        }}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export const CustomAutoComplete = () => {
  const theme = useCustomTheme();
  const { loading, results, activeSearch, selectItem, index } =
    useContext(RichMentionsContext);
  const cursor = index;

  const shownResults = useMemo(() => results, [results]);

  const users = useUsersMetadata({ remoteUserIds: results.map((r) => r.id) });

  return (
    <div
      style={{
        width: 180,
        position: "absolute",
        bottom: 44,
        boxShadow: theme.custom.colors.boxShadow,
        background: theme.custom.colors.bg3,
        paddingTop: activeSearch && 8,
        paddingBottom: activeSearch && 8,
        borderRadius: 8,
        backdropFilter: "blur(20px)",
        overflow: "hidden",
      }}
    >
      {shownResults.map((item, index) => (
        <button
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 8,
            paddingBottom: 8,
            display: "flex",
            cursor: "pointer",
            width: "100%",
            background:
              index === cursor
                ? theme.custom.colors.listItemHover
                : "transparent",
            color: theme.custom.colors.fontColor,
            border: "none",
            textAlign: "left",
          }}
          key={item.ref}
          onClick={() => {
            selectItem(item);
          }}
        >
          <img
            style={{ height: 24, borderRadius: 12, marginRight: 8 }}
            src={users[item.id]?.image}
          />
          <div style={{ fontSize: 15 }}>@{item.name}</div>
        </button>
      ))}
      {activeSearch !== "" &&
      activeSearch &&
      activeSearch.length !== 0 &&
      loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 3,
            marginTop: 3,
          }}
        >
          {" "}
          <CircularProgress size={20} />{" "}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
