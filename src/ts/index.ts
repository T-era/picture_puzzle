import '../pug/index.scss';
import { GameContext, PrepareContext } from './action/context';
import { ImageSplitter, filePreviewInit } from './init';
import { FieldPart } from './init/partsFactory';
import { Setting } from './types';

filePreviewInit();
const prepare = new PrepareContext();

const imageSplitter = new ImageSplitter({
    onSettingChanged(setting :Setting<FieldPart>) {
        prepare.setSetting(setting);
    }
})
export {};
