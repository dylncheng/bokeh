import {ActionTool, ActionToolView} from "./action_tool"
import {CustomJS} from "models/callbacks/customjs"
import type {CallbackLike0} from "core/util/callbacks"
import {execute} from "core/util/callbacks"
import {isBoolean} from "core/util/types"
import type * as p from "core/properties"
import * as icons from "styles/icons.css"
import {logger} from "core/logging"

export class CustomActionView extends ActionToolView {
  declare model: CustomAction

  protected async _update_active(): Promise<void> {
    const {active_callback} = this.model
    if (active_callback != null) {
      const active = await execute(active_callback, this.model)
      if (isBoolean(active)) {
        this.model.active = active
      } else {
        logger.warn(`${this.model}.active_callback (${active_callback}) did not return a boolean value`)
      }
    }
  }

  override async lazy_initialize(): Promise<void> {
    await super.lazy_initialize()
    await this._update_active()
  }

  async _execute(): Promise<void> {
    const {callback} = this.model
    if (callback != null) {
      const active = await execute(callback, this.model)
      if (isBoolean(active)) {
        this.model.active = active
      } else {
        await this._update_active()
      }
    }
  }

  doit(): void {
    void this._execute()
  }
}

export namespace CustomAction {
  export type Attrs = p.AttrsOf<Props>

  export type Props = ActionTool.Props & {
    callback: p.Property<CustomJS | CallbackLike0<CustomAction> | null>
    active_callback: p.Property<CustomJS | CallbackLike0<CustomAction> | null>
  }
}

export interface CustomAction extends CustomAction.Attrs {}

export class CustomAction extends ActionTool {
  declare properties: CustomAction.Props
  declare __view_type__: CustomActionView

  constructor(attrs?: Partial<CustomAction.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = CustomActionView

    this.define<CustomAction.Props>(({Func, Nullable, Ref, Or}) => ({
      callback: [ Nullable(Or(Ref(CustomJS), Func())), null ],
      active_callback: [ Nullable(Or(Ref(CustomJS), Func())), null ],
    }))

    this.override<CustomAction.Props>({
      description: "Perform a Custom Action",
    })
  }

  override tool_name = "Custom Action"
  override tool_icon = icons.tool_icon_unknown
}
