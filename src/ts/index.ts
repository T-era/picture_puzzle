import '../pug/index.scss';
import { GameContext } from './action/context';
import { ImageSplitter, filePreviewInit } from './init';
import { FieldPart } from './init/partsFactory';
import { Setting } from './types';

filePreviewInit();
const game = new GameContext();

const imageSplitter = new ImageSplitter({
    onSettingChanged(setting :Setting<FieldPart>) {
        game.setSetting(setting);
    }
})
export {};
