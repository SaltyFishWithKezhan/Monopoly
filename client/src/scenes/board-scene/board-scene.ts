import 'animate.css';

import $ from 'jquery';
import {Scene} from 'phaser';
import {ConstructionLand, LandInfo, LandType, Player, PlayerData} from 'shared';

import {
  gameService,
  modelService,
  playerService,
} from '../../service-entrances';
import {
  gameHeight,
  gameWidth,
  height,
  scale,
  scaleGameObject,
  width,
} from '../../utils/ratio';

import './style.less';

export interface LandPos {
  x: number;
  y: number;
  type: string;
}

export class BoardScene extends Scene {
  private gameOptions = {
    landCount: 20,
    paddingX: width(10),
    paddingY: height(20),
  };

  // board 位置数组
  private boardPosList: LandPos[] = [];

  // private boardData: any;

  private myDice: any | undefined;

  private points = [
    // bottom:
    {
      pos: 'bottom',
      x: gameWidth / 2,
      y: gameHeight - this.gameOptions.paddingY,
      posX: -1,
      posY: -1,
    },
    // left:
    {
      pos: 'left',
      x: this.gameOptions.paddingX,
      y: gameHeight / 2,
      posX: 1,
      posY: -1,
    },
    // top:
    {
      pos: 'top',
      x: gameWidth / 2,
      y: this.gameOptions.paddingY,
      posX: 1,
      posY: 1,
    },
    // right:
    {
      pos: 'right',
      x: gameWidth - this.gameOptions.paddingX,
      y: gameHeight / 2,
      posX: -1,
      posY: 1,
    },
  ];

  private playerOffset = [
    {
      offsetX: 0.02,
      offsetY: -0.05,
    },
    {
      offsetX: 0,
      offsetY: -0.08,
    },
    {
      offsetX: 0,
      offsetY: -0.01,
    },
    {
      offsetX: -0.02,
      offsetY: -0.05,
    },
  ];

  private paddingX: number = 10;
  private paddingY: number = 10;
  private playerStyle = [
    {
      // top-left
      img: 'player0',
      land: 'yellow-block',
      backgroundLine: 'yellow-bg',
      color: '#fccf39',
      posX: width(this.paddingX),
      posY: height(this.paddingY),
    },
    {
      // bottom-right
      img: 'player1',
      land: 'blue-block',
      backgroundLine: 'blue-bg',
      color: '#355973',
      posX: gameWidth - width(this.paddingX),
      posY: gameHeight - height(this.paddingY),
    },
    {
      // top-right
      img: 'player2',
      land: 'green-block',
      backgroundLine: 'green-bg',
      color: '#65bc16',
      posX: gameWidth - width(this.paddingX),
      posY: height(this.paddingY),
    },
    {
      // bottom-left
      img: 'player3',
      land: 'red-block',
      backgroundLine: 'red-bg',
      color: '#b91124',
      posX: width(this.paddingX),
      posY: gameHeight - height(this.paddingY),
    },
  ];

  private landGroup!: Phaser.GameObjects.Group;
  private houseGroup!: Phaser.GameObjects.Group;
  private playerGroup!: Phaser.GameObjects.Group;
  private playerInfoGroup!: Phaser.GameObjects.Group;
  private decisionGroup!: Phaser.GameObjects.Group;
  private statusGroup!: Phaser.GameObjects.Group;

  private bezierGraphics!: Phaser.GameObjects.Graphics;
  // private player!:Phaser.GameObjects.Image;
  // private bezierCurve!: Phaser.Curves.CubicBezier;
  // private tween: Phaser.Tweens.Tween;

  private i: number = 0;
  private houseMap = new Map<number, Phaser.GameObjects.Image>();

  private player: PlayerData | undefined;
  private board: LandInfo[] | undefined;
  private playerNames: string[] | undefined; // name & id
  private playerDetails: Player[] | undefined;
  private currentPlayerId: number | undefined;

  constructor() {
    super({key: 'BoardScene'});
  }

  init(): void {
    console.info(gameService.board);
    console.info(gameService.game);
    console.info(playerService.player);
    this.player = playerService.player!.data;
    this.playerNames = gameService.game!.data.players;
    this.board = gameService.board!.data.lands;
    this.gameOptions.landCount = this.board.length;
    this.playerDetails = modelService.getModelsByIds(
      'player',
      this.playerNames,
    );
    this.currentPlayerId = gameService.game!.data.currentPlayerIndex;
  }

  preload(): void {
    this.load.pack('board', 'data/asset-pack.json', undefined, this as any);
    // this.load.image('green-block', 'assets/green-block.png');
    // this.load.json({
    //   key: 'board-pos',
    //   url: 'data/board.json',
    // });

    this.load.script('dice-script', '/js/dice.js');
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    );
  }

  create(): void {
    this.landGroup = this.add.group();
    this.houseGroup = this.add.group();
    this.playerGroup = this.add.group();
    this.playerInfoGroup = this.add.group();
    this.decisionGroup = this.add.group();
    this.statusGroup = this.add.group();
    this.bezierGraphics = this.add.graphics();

    this.createScene();

    this.createDice();
    this.onRollDice();

    if (this.playerNames![this.currentPlayerId!] === playerService.player!.id) {
      this.isCurrentPlayer();
    } else {
      this.notCurrentPlayer();
    }

    this.input.on(
      'gameobjectup',
      (_pointer: any, gameObject: any) => {
        gameObject.emit('click', gameObject);
      },
      this,
    );

    // register call backs
    gameService.onMoveOnGoLand(player => {
      let index = this.findPlayerIndexByPlayerName(player.id);
      let mdfPlayerMoney = this.playerInfoGroup.getChildren()[
        index
      ] as Phaser.GameObjects.Text;
      mdfPlayerMoney.setText(`¥${player.data.money}`);
    });

    gameService.onBailJail(player => {
      let index = this.findPlayerIndexByPlayerName(player.id);
      let mdfPlayerMoney = this.playerInfoGroup.getChildren()[
        index
      ] as Phaser.GameObjects.Text;
      mdfPlayerMoney.setText(`¥${player.getMoney()}`);
    });

    gameService.onServeJail(player => {});

    gameService.onMoveConRent((player, owner) => {
      let playerIndex = this.findPlayerIndexByPlayerName(player.id);
      let mdfPlayerMoney = this.playerInfoGroup.getChildren()[
        playerIndex
      ] as Phaser.GameObjects.Text;
      mdfPlayerMoney.setText(`¥${player.getMoney()}`);

      let ownerIndex = this.findPlayerIndexByPlayerName(owner.id);
      let mdfOwnerMoney = this.playerInfoGroup.getChildren()[
        ownerIndex
      ] as Phaser.GameObjects.Text;
      mdfOwnerMoney.setText(`¥${owner.getMoney()}`);
    });

    gameService.onMoveConBuy((player, land) => {
      let playerIndex = this.findPlayerIndexByPlayerName(player.id);
      let mdfPlayerMoney = this.playerInfoGroup.getChildren()[
        playerIndex
      ] as Phaser.GameObjects.Text;
      mdfPlayerMoney.setText(`¥${player.data.money}`);
      let landIndex = this.findLandIndexByModelId(land.id);
      console.log('index!!!:::', landIndex);
      this.changeLand(landIndex, playerIndex);
    });

    gameService.onMoveConUpgrade((player, land) => {
      let playerIndex = this.findPlayerIndexByPlayerName(player.id);
      let mdfPlayerMoney = this.playerInfoGroup.getChildren()[
        playerIndex
      ] as Phaser.GameObjects.Text;
      mdfPlayerMoney.setText(`¥${player.data.money}`);
      let landIndex = this.findLandIndexByModelId(land.id);
      this.changeLand(landIndex, playerIndex);
      switch (land.data.level) {
        case 1:
          console.info('买一级平房');
          this.drawHouse(landIndex, land.data.level);
          break;
        case 2:
          console.info('买二级小楼房');
          this.drawHouse(landIndex, land.data.level);
          break;
      }
    });

    gameService.onMoveOnNextPlayer(game => {
      let player = playerService.player!;

      if (game.getCurrentPlayerId() === player.id) {
        if (!player.isInJail()) {
          this.isCurrentPlayer();
          return;
        }

        let landInfo = player.getLand();

        let jailLand = modelService.getModelById('jailLand', landInfo.id);

        if (!jailLand) {
          throw new Error(`JailLand ${landInfo.id} does not exist`);
        }

        if (jailLand.getBailPrice() >= player.getMoney()) {
          gameService.serveJailTime(false);
        } else {
          this.popupDecision(
            `您当前在监狱中，是否花¥${jailLand.getBailPrice()}保释？`,
            yes => {
              gameService.serveJailTime(yes);
            },
          );
        }
      } else {
        this.notCurrentPlayer();
      }
    });

    gameService.onDiceRolled((oldLandId, currentPlayer) => {
      let player = playerService.player!;

      if (player.id === currentPlayer.id) {
        return;
      }

      let oldLandIndex = this.findLandIndexByModelId(oldLandId);

      let newLandIndex = this.findLandIndexByModelId(
        currentPlayer.getLand().id,
      );

      let step = newLandIndex - oldLandIndex;

      step = step < 0 ? gameService.board!.getLands().length + step : step;

      let playerIndex = this.findPlayerIndexByPlayerName(currentPlayer.id);

      this.playerJump(playerIndex, oldLandIndex, step, false);
    });

    // this.rollDice(); // for test

    // this.playerJump(1); // for test

    // this.popupDecision(); // for test
  }

  update(): void {
    // Phaser.Actions.ScaleXY(this.decisionGroup.getChildren(), 5, 1, 2, 2);
  }

  private createScene(): void {
    this.createBoard();
    this.createPlayersInfo(this.playerNames!.length);
    this.createPlayers(this.playerNames!.length);
  }

  private createBoard(): void {
    this.analyseBoard();
    this.drawBoardFromJson();
  }

  // 计算board坐标
  private analyseBoard(): void {
    let count = this.gameOptions.landCount / 4;
    let offsetX = (gameWidth / 2 - this.gameOptions.paddingX) / count;
    let offsetY = (gameHeight / 2 - this.gameOptions.paddingY) / count;
    this.points.forEach(element => {
      for (let i = 0; i < count; i++) {
        let landX = element.x + element.posX * offsetX * i;
        let landY = element.y + element.posY * offsetY * i;
        let pos = element.pos + i;
        let posJson = {
          x: landX / gameWidth,
          y: landY / gameHeight,
          type: 'neutral',
        };
        // this.drawLand(landX, landY, 'blue-block');
        this.boardPosList.push(posJson);
      }
    });

    for (let index = 0; index < this.board!.length; index++) {
      switch (this.board![index].type) {
        case 0:
          this.boardPosList[index].type = 'start';
          break;
        case 1:
          this.boardPosList[index].type = 'neutral';
          break;
        case 2:
          this.boardPosList[index].type = 'jail';
          break;
        case 3:
          this.boardPosList[index].type = 'parking';
          break;
      }
    }

    console.info('this.boardPosList');
    console.info(this.boardPosList);
    // this.load.saveJSON(boardJson, 'file/test.json');
  }

  private drawBoardFromJson(): void {
    this.boardPosList.forEach(element => {
      this.drawLand(
        element.x * gameWidth,
        element.y * gameHeight,
        element.type,
      );
    });
  }

  private drawLand(x: number, y: number, image: string): void {
    let land = this.add.image(x, y, image);
    scaleGameObject(land, 24 / this.gameOptions.landCount);
    this.landGroup.add(land);
    // console.info(this.landGroup.getChildren());
  }

  private changeLand(landNum: number, newOwnerIndex: number): void {
    let oldLand = this.landGroup.getChildren()[
      landNum
    ] as Phaser.GameObjects.Image;
    oldLand.setTexture(this.playerStyle[newOwnerIndex].land);
    // console.info(this.landGroup.getChildren());
  }

  private drawHouse(landNum: number, type: number): void {
    let landPos = this.boardPosList[landNum];

    if (this.houseMap.get(landNum)) {
      this.houseMap.get(landNum)!.destroy();
    }

    let house = this.add.image(
      (landPos.x - 0.02) * gameWidth,
      (landPos.y - 0.05) * gameHeight,
      `building-level${type}-${landNum}`,
    );
    scaleGameObject(house, 0.4);
    this.houseMap.set(landNum, house);
  }

  private createPlayers(playerNum: number): void {
    let concatStrNum = (str: string, num: number): string => str + num;
    let landPos = this.boardPosList[0];

    for (let i = 0; i < playerNum; i++) {
      let playerImgName = concatStrNum('player', i);
      let x = (landPos.x + this.playerOffset[i].offsetX) * gameWidth;
      let y = (landPos.y + this.playerOffset[i].offsetY) * gameHeight;
      let player = this.add.image(x, y, playerImgName);
      scaleGameObject(player, 0.7);
      player.setDepth(10);
      this.playerGroup.add(player);
    }
  }

  private createPlayersInfo(playerNum: number): void {
    let concatStrNum = (str: string, num: number): string => str + num;
    let paddingX = 10;
    let paddingY = 5;

    for (let i = 0; i < playerNum; i++) {
      let infoLinePos = this.statInfoPos(paddingX, paddingY + 4, i);
      let playerLine = this.add.image(
        infoLinePos!.x,
        infoLinePos!.y,
        this.playerStyle[i].backgroundLine,
      );
      scaleGameObject(playerLine, 0.5);
      // console.info(infoLinePos);
      let infoTextPos = this.statInfoPos(paddingX - 1, paddingY + 10, i);
      let playerInfoText = this.add.text(
        infoTextPos!.x,
        infoTextPos!.y,
        this.playerNames![i],
        {
          fontFamily: 'Arial Black',
          fontSize: 60,
          color: this.playerStyle[i].color,
        },
      );
      playerInfoText.setOrigin(0.5, 0.5);
      playerInfoText
        .setStroke(this.playerStyle[i].color, 4)
        .setShadow(2, 2, '#fff', 8, true, true);
      scaleGameObject(playerInfoText);
      // this.playerInfoGroup.add(playerInfoText);

      let infoMoneyPos = this.statInfoPos(paddingX - 1, paddingY - 1, i);
      let playerMoney = this.add.text(
        infoMoneyPos!.x,
        infoMoneyPos!.y,
        `¥${this.playerDetails![i].data.money}`,
        {
          fontFamily: 'Arial Black',
          fontSize: 60,
          color: this.playerStyle[i].color,
        },
      );
      playerMoney.setOrigin(0.5, 0.5);
      playerMoney.setStroke('#fff', 16).setShadow(2, 2, '#fff', 2, true, true);
      scaleGameObject(playerMoney);
      this.playerInfoGroup.add(playerMoney);

      let infoImgPos = this.statInfoPos(paddingX + 10, paddingY + 2, i);
      let playerImg = this.add.image(
        infoImgPos!.x,
        infoImgPos!.y,
        this.playerStyle[i].img,
      );
      scaleGameObject(playerImg, 1);
    }
  }

  private statInfoPos(
    paddingx: number,
    paddingy: number,
    index: number,
  ): LandPos | undefined {
    let ret: LandPos | undefined;
    switch (index) {
      case 0:
        ret = {
          x: width(paddingx),
          y: height(paddingy),
          type: 'top-left',
        };
        break;
      case 1:
        ret = {
          x: gameWidth - width(paddingx),
          y: gameHeight - height(paddingy),
          type: 'bottom-right',
        };
        break;
      case 2:
        ret = {
          x: gameWidth - width(paddingx),
          y: height(paddingy),
          type: 'top-right',
        };
        break;
      case 3:
        ret = {
          x: width(paddingx),
          y: gameHeight - height(paddingy),
          type: 'bottom-left',
        };
        break;
    }
    return ret;
  }

  private createDice = (): void => {
    if ($('#area').length) {
      return;
    }

    $('#game-playground').append(
      `<div id="area"
       style=" width: ${width(25)}px;
              height: ${height(20)}px;">
        <div id="dice-area"></div>
        <div id="operation">
        <button id="roll-btn"
        style="margin: ${height(4)}px;
               width: ${height(13.5)}px;
               height: ${height(13.5 * 0.6)}px;"
        ></button>
      </div>
    </div>
      `,
    );

    this.myDice = dice(document.getElementById('dice-area'), width(10));

    // $('#stop-btn').on('click', () => {
    //   myDice.stop();
    // });
  };

  private onRollDice = (): void => {
    $('#roll-btn').on('click', () => {
      let faceValue = Math.ceil(Math.random() * 6);
      this.myDice.roll(faceValue);
      console.info(faceValue);
      // $('#roll-btn').attr('disabled', 'true');

      // $('#roll-btn').removeAttr('disable');
      // this.i = (this.i + 1) % ((this.gameOptions.landCount - 1) * 4);
      // console.info(this.boardPosList[this.i]);
      let landIndex = this.i;
      // this.findLandIndexByModelId(this.player!.landId);
      let playerIndex = this.findPlayerIndexByPlayerName(
        playerService.player!.id,
      );
      let endLand = this.playerJump(playerIndex, landIndex, faceValue);
      this.i = endLand;
      console.log(endLand);

      this.time.delayedCall(
        3000 + 800 * faceValue,
        () => {
          this.landEvent(faceValue, endLand);
        },
        [],
        this,
      );
    });
  };

  private findLandIndexByModelId = (modelId: string): number => {
    for (let index = 0; index < this.board!.length; index++) {
      if (this.board![index].id === modelId) {
        return index;
      }
    }

    return -1;
  };

  private findPlayerIndexByPlayerName = (modelId: string): number => {
    for (let index = 0; index < this.playerNames!.length; index++) {
      if (this.playerNames![index] === modelId) {
        return index;
      }
    }

    return -1;
  };

  // this.playerJump(this.i); // for test
  private playerJump = (
    playerIndex: number,
    pos: number,
    step: number,
    delay: boolean = true,
  ): number => {
    // pos init
    let nextPos = pos;

    for (let stepTurn = pos; stepTurn < pos + step; stepTurn++) {
      let firstPos = stepTurn % this.gameOptions.landCount;
      let start = {
        x: this.boardPosList[firstPos].x * gameWidth,
        y: this.boardPosList[firstPos].y * gameHeight,
      };
      nextPos = (stepTurn + 1) % this.gameOptions.landCount;
      let end = {
        x: this.boardPosList[nextPos].x * gameWidth,
        y: this.boardPosList[nextPos].y * gameHeight,
      };

      console.log(firstPos, nextPos);

      this.time.delayedCall(
        800 * (stepTurn - pos + 1),
        () => {
          this.movePlayer(playerIndex, start, end, delay);
        },
        [],
        this,
      );
    }

    // this.movePlayer({x: 100, y: 100}, {x: 200, y: 200});
    return nextPos;
  };

  private movePlayer = (
    playerIndex: number,
    start: any,
    end: any,
    delay: boolean = true,
  ): void => {
    console.log(start);
    let startPoint = new Phaser.Math.Vector2(start.x, start.y);
    let endPoint = new Phaser.Math.Vector2(end.x, end.y);
    let stepX = end.x - start.x;
    let stepY = end.y - start.y;
    console.info(start.x);
    let marker = this.playerGroup.getChildren()[
      playerIndex
    ] as Phaser.GameObjects.Image;
    let controlPoint1 = new Phaser.Math.Vector2(
      start.x,
      start.y - Math.abs((stepY * 2) / 3),
    );
    let controlPoint2 = new Phaser.Math.Vector2(
      end.x,
      end.y - Math.abs((stepY * 2) / 3),
    );
    let bezierCurve = new Phaser.Curves.CubicBezier(
      startPoint,
      controlPoint1,
      controlPoint2,
      endPoint,
    );
    // this.bezierGraphics.x = 0.02 * gameWidth;
    this.bezierGraphics.y = 0; // -0.05 * gameHeight;
    this.bezierGraphics.clear();
    this.bezierGraphics.lineStyle(4, 0xffffff);
    bezierCurve.draw(this.bezierGraphics);

    this.bezierGraphics.setDepth(5);
    let tweenValue = {
      value: 0,
      previousValue: 0,
    };
    this.tweens.add({
      targets: tweenValue,
      value: 1,
      duration: 800,
      callbackScope: this,
      delay: delay ? 2500 : undefined,
      onComplete: () => {},
      onUpdate: (tween: Phaser.Tweens.TweenManager, target: any) => {
        let position = bezierCurve.getPoint(target.value);
        let prevPosition = bezierCurve.getPoint(target.previousValue);
        let step = target.value - target.previousValue;
        marker.x += position.x - prevPosition.x;
        marker.y += position.y - prevPosition.y;
        target.previousValue = target.value;
      },
    });
  };

  private popupDecision(message: string, cb: (yes: boolean) => void): void {
    $('#area').hide();
    let decisionBox = this.add.image(width(50), height(49), 'decision-bg');
    decisionBox.setDepth(20);
    scaleGameObject(decisionBox, 0);
    this.decisionGroup.add(decisionBox);

    let decisionHint = this.add.text(width(50), height(45), message, {
      fontFamily: 'Arial Black',
      fontSize: 100,
      color: '#f1c50e',
    });
    decisionHint.setOrigin(0.5, 0.5);
    decisionHint.setDepth(100);
    decisionHint.setStroke('#000', 15).setShadow(2, 2, '#222', 10, true, true);
    scaleGameObject(decisionHint);

    decisionHint.setDepth(30);
    scaleGameObject(decisionBox, 0);
    this.decisionGroup.add(decisionHint);

    let decisionBtnYes = this.add.image(width(45), height(57), 'game-btn-yes');

    decisionBtnYes.setInteractive();
    decisionBtnYes.on(
      'click',
      () => {
        this.closeDecision();
        cb(true);
      },
      this,
    );
    scaleGameObject(decisionBtnYes, 0);
    decisionBtnYes.setDepth(30);
    this.decisionGroup.add(decisionBtnYes);

    let decisionBtnNo = this.add.image(width(55), height(57), 'game-btn-no');
    decisionBtnNo.setInteractive();
    decisionBtnNo.on(
      'click',
      () => {
        this.closeDecision();
        cb(false);
      },
      this,
    );
    scaleGameObject(decisionBtnNo, 0);
    decisionBtnNo.setDepth(30);
    this.decisionGroup.add(decisionBtnNo);

    this.tweens.timeline({
      targets: this.decisionGroup.getChildren(),
      ease: 'Sine.easeInOut',
      totalDuration: 300,
      tweens: [
        {
          scaleX: scale(0.8),
          scaleY: scale(0.8),
        },
        {
          scaleX: scale(0.4),
          scaleY: scale(0.4),
        },
        {
          scaleX: scale(0.5),
          scaleY: scale(0.5),
        },
      ],
    });
  }

  private popupStatus(text: string): void {
    $('#area').hide();
    let statusBox = this.add.image(width(50), height(49), 'decision-bg');
    statusBox.setDepth(20);
    scaleGameObject(statusBox, 0);
    this.statusGroup.add(statusBox);

    let statusHint = this.add.text(width(50), height(50), text, {
      fontFamily: 'Arial Black',
      fontSize: 100,
      color: '#443f33',
    });
    statusHint.setOrigin(0.5, 0.5);
    statusHint.setDepth(100);
    statusHint.setStroke('#FFF', 10).setShadow(2, 2, '#222', 4, true, true);
    scaleGameObject(statusHint);

    statusHint.setDepth(30);
    scaleGameObject(statusHint, 0);
    this.statusGroup.add(statusHint);

    this.tweens.timeline({
      targets: this.statusGroup.getChildren(),
      ease: 'Sine.easeInOut',
      totalDuration: 300,
      tweens: [
        {
          scaleX: scale(0.8),
          scaleY: scale(0.8),
        },
        {
          scaleX: scale(0.4),
          scaleY: scale(0.4),
        },
        {
          scaleX: scale(0.5),
          scaleY: scale(0.5),
        },
      ],
    });
  }

  private closeDecision(): void {
    this.decisionGroup.children.iterate(child => {
      child.setVisible(false);
    }, 0);
  }

  private closeStatus(): void {
    this.statusGroup.children.iterate(child => {
      child.setVisible(false);
    }, 0);
  }

  private isCurrentPlayer(): void {
    this.closeStatus();
    $('#area').show();
  }

  private notCurrentPlayer(): void {
    this.popupStatus(
      `${this.playerNames![this.currentPlayerId!]}\n正在进行游戏,请稍等`,
    );
  }

  private landEvent(step: number, pos: number): void {
    let landType = this.board![pos].type;
    let landId = this.board![pos].id;

    switch (landType) {
      case LandType.construction:
        let land = modelService.getModelById('constructionLand', landId);

        if (!land) {
          throw new Error(`Construction land ${landId} doesn't exist`);
        }

        this.checkLandAndPopupOptions(step, land);
        break;
      default:
        gameService.diceAndDecide(step);
        break;
    }
  }

  private checkLandAndPopupOptions(step: number, land: ConstructionLand): void {
    let player = playerService.player!;

    if (land.getOwner() === player.id) {
      // Can upgrade
      if (land.getLevel() < 2 && land.getUpgradePrice() < player.getMoney()) {
        this.popupDecision(
          `您可以花¥${land.getUpgradePrice()}升级房\n屋到${land.getLevel() +
            1}级，是否升级？`,
          yes => {
            if (yes) {
              gameService.diceAndDecide(step, 'upgrade');
            } else {
              gameService.diceAndDecide(step, 'pass');
            }
          },
        );
      } else {
        gameService.diceAndDecide(step, 'pass');
      }
    } else {
      if (land.getLevel() < 2 && land.getPrice() < player.getMoney()) {
        this.popupDecision(
          `您可以花¥${land.getPrice()}来购买该房屋，\n是否购买？`,
          yes => {
            if (yes) {
              gameService.diceAndDecide(step, 'buy');
            } else if (land.getOwner()) {
              gameService.diceAndDecide(step, 'rent');
            }
          },
        );
      }
    }
  }
}
