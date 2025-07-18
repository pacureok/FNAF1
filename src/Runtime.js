// CJoystick object
	// -----------------------------------------------------------------
	var CJoystick = {};
	CJoystick.KEY_JOYSTICK = 0;
	CJoystick.KEY_FIRE1 = 1;
	CJoystick.KEY_FIRE2 = 2;
	CJoystick.KEY_NONE = -1;
	CJoystick.MAX_TOUCHES = 3;
	CJoystick.JFLAG_JOYSTICK = 0x0001;
	CJoystick.JFLAG_FIRE1 = 0x0002;
	CJoystick.JFLAG_FIRE2 = 0x0004;
	CJoystick.JFLAG_LEFTHANDED = 0x0008;
	CJoystick.JPOS_NOTDEFINED = 0x80000000;
	CJoystick.JOY_ANGLEGAP = 70;
	CJoystick.DPAD_ANGLEGAP = 60;
	CJoystick.DEADZONE = 0.5;

	CJoystick.CJoystick = function ()
	{
		this.joyBack = null;
		this.joyFront = null;
		this.fire1U = null;
		this.fire2U = null;
		this.fire1D = null;
		this.fire2D = null;
		this.imagesX = [];
		this.imagesY = [];
		this.joystickX = [];
		this.joystickY = [];
		this.joystick = null;
		this.flags = 0;
		this.touches = [];
		this.bSetPositions = false;
		this.isJoystick = false;
		this.joydeadzone = 0;
		this.joyanglezone = 0;
	};

	CJoystick.CJoystick.prototype =
	{
		create: function (app)
		{
			this.app = app;
			this.touches = new Array(CJoystick.MAX_TOUCHES);
			var n;
			for (n = 0; n < CJoystick.MAX_TOUCHES; n++)
			{
				this.touches[n] = {};
				this.touches[n].active = false;
				this.touches[n].x = 0;
				this.touches[n].y = 0;
				this.touches[n].ID = -1;
			}
			this.joydeadzone = CJoystick.DEADZONE;
			this.joyanglezone = CJoystick.JOY_ANGLEGAP;
		},

		setPositions: function ()
		{
			if (this.bSetPositions == true)
			{
				return;
			}
			this.bSetPositions = true;

			this.flags = this.app.get  Application().joystickFlags;
			this.imagesX[CJoystick.KEY_JOYSTICK] = this.app.get  Application().joystickX;
			this.imagesY[CJoystick.KEY_JOYSTICK] = this.app.get  Application().joystickY;
			this.imagesX[CJoystick.KEY_FIRE1] = this.app.get  Application().joystickFire1X;
			this.imagesY[CJoystick.KEY_FIRE1] = this.app.get  Application().joystickFire1Y;
			this.imagesX[CJoystick.KEY_FIRE2] = this.app.get  Application().joystickFire2X;
			this.imagesY[CJoystick.KEY_FIRE2] = this.app.get  Application().joystickFire2Y;

			this.joystickX[CJoystick.KEY_JOYSTICK] = this.imagesX[CJoystick.KEY_JOYSTICK];
			this.joystickY[CJoystick.KEY_JOYSTICK] = this.imagesY[CJoystick.KEY_JOYSTICK];
			this.joystickX[CJoystick.KEY_FIRE1] = this.imagesX[CJoystick.KEY_FIRE1];
			this.joystickY[CJoystick.KEY_FIRE1] = this.imagesY[CJoystick.KEY_FIRE1];
			this.joystickX[CJoystick.KEY_FIRE2] = this.imagesX[CJoystick.KEY_FIRE2];
			this.joystickY[CJoystick.KEY_FIRE2] = this.imagesY[CJoystick.KEY_FIRE2];

			this.isJoystick = false;
			var b = this.flags & CJoystick.JFLAG_JOYSTICK;
			if (b != 0)
			{
				var x = this.imagesX[CJoystick.KEY_JOYSTICK];
				var y = this.imagesY[CJoystick.KEY_JOYSTICK];
				if (x != CJoystick.JPOS_NOTDEFINED && y != CJoystick.JPOS_NOTDEFINED)
				{
					this.joyBack = new CSprite();
					this.joyBack.create(this.app.imageBank.getImageFromHandle(CRuntime.inst.joystickImageBack));
					this.joyBack.setX(x);
					this.joyBack.setY(y);
					this.joyBack.setAlpha(128);

					this.joyFront = new CSprite();
					this.joyFront.create(this.app.imageBank.getImageFromHandle(CRuntime.inst.joystickImageFront));
					this.joyFront.setX(x);
					this.joyFront.setY(y);
					this.joyFront.setAlpha(128);

					this.isJoystick = true;
					this.joystick = new CJoystickZone();
					this.joystick.create(this, CJoystick.KEY_JOYSTICK);
				}
			}

			b = this.flags & CJoystick.JFLAG_FIRE1;
			if (b != 0)
			{
				var x = this.imagesX[CJoystick.KEY_FIRE1];
				var y = this.imagesY[CJoystick.KEY_FIRE1];
				if (x != CJoystick.JPOS_NOTDEFINED && y != CJoystick.JPOS_NOTDEFINED)
				{
					this.fire1U = new CSprite();
					this.fire1U.create(this.app.imageBank.getImageFromHandle(CRuntime.inst.joystickImageFire1U));
					this.fire1U.setX(x);
					this.fire1U.setY(y);
					this.fire1U.setAlpha(128);
					this.fire1D = new CSprite();
					this.fire1D.create(this.app.imageBank.getImageFromHandle(CRuntime.inst.joystickImageFire1D));
					this.fire1D.setX(x);
					this.fire1D.setY(y);
					this.fire1D.setAlpha(128);

					this.joystick = new CJoystickZone();
					this.joystick.create(this, CJoystick.KEY_FIRE1);
				}
			}

			b = this.flags & CJoystick.JFLAG_FIRE2;
			if (b != 0)
			{
				var x = this.imagesX[CJoystick.KEY_FIRE2];
				var y = this.imagesY[CJoystick.KEY_FIRE2];
				if (x != CJoystick.JPOS_NOTDEFINED && y != CJoystick.JPOS_NOTDEFINED)
				{
					this.fire2U = new CSprite();
					this.fire2U.create(this.app.imageBank.getImageFromHandle(CRuntime.inst.joystickImageFire2U));
					this.fire2U.setX(x);
					this.fire2U.setY(y);
					this.fire2U.setAlpha(128);
					this.fire2D = new CSprite();
					this.fire2D.create(this.app.imageBank.getImageFromHandle(CRuntime.inst.joystickImageFire2D));
					this.fire2D.setX(x);
					this.fire2D.setY(y);
					this.fire2D.setAlpha(128);

					this.joystick = new CJoystickZone();
					this.joystick.create(this, CJoystick.KEY_FIRE2);
				}
			}
		},

		display: function ()
		{
			if (this.joyBack != null)
			{
				this.joyBack.display();
			}
			if (this.joyFront != null)
			{
				this.joyFront.display();
			}
			if (this.fire1U != null)
			{
				var b = this.app.get  Application().isControlPressed(CJoystick.KEY_FIRE1);
				if (b == true)
				{
					this.fire1D.display();
				}
				else
				{
					this.fire1U.display();
				}
			}
			if (this.fire2U != null)
			{
				var b = this.app.get  Application().isControlPressed(CJoystick.KEY_FIRE2);
				if (b == true)
				{
					this.fire2D.display();
				}
				else
				{
					this.fire2U.display();
				}
			}
		},

		onTouchStart: function (x, y, id)
		{
			if (this.joystick != null)
			{
				this.joystick.onTouchStart(x, y, id);
			}
		},

		onTouchMove: function (x, y, id)
		{
			if (this.joystick != null)
			{
				this.joystick.onTouchMove(x, y, id);
			}
		},

		onTouchEnd: function (x, y, id)
		{
			if (this.joystick != null)
			{
				this.joystick.onTouchEnd(x, y, id);
			}
		},

		getAngle: function ()
		{
			if (this.joystick != null)
			{
				return this.joystick.getAngle();
			}
			return 0;
		},

		getDir: function ()
		{
			if (this.joystick != null)
			{
				return this.joystick.getDir();
			}
			return -1;
		},

		isPressed: function (key)
		{
			if (this.joystick != null)
			{
				return this.joystick.isPressed(key);
			}
			return false;
		}
	};