import buildfire from "buildfire";
import Enum from "../../../widget/common/helper/enum";
import { stringsUI } from "./stringsUI";
import { stringsConfig } from "../../../widget/common/repository/stringsConfig";
import Strings from '../../../widget/common/repository/strings'

function loadLanguage(lang) {
let strings;
  buildfire.messaging.sendMessageToWidget({
    id: Enum.messageType.closeItem,
    openSubItemPage: false,
  });
  strings = new Strings(lang, stringsConfig);
  strings.init().then(() => {
    stringsContainer.classList.remove("hidden");
    strings.inject();
  });
  stringsUI.init("stringsContainer", strings, stringsConfig);
}
loadLanguage("en-US");
